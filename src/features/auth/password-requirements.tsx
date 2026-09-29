import { Check, Circle, X } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors } from '@/theme';

import { evaluatePasswordRules } from './password-rules';

type PasswordRequirementsProps = {
  password: string;
  /** False until the user has interacted — rows stay neutral. */
  interactive: boolean;
};

export function PasswordRequirements({ password, interactive }: PasswordRequirementsProps) {
  const results = evaluatePasswordRules(password);

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel="Password requirements"
      style={{ gap: 6, minHeight: 120 }}
    >
      {results.map((rule) => {
        const status = !interactive ? 'neutral' : rule.met ? 'pass' : 'fail';
        const color =
          status === 'pass' ? colors.success : status === 'fail' ? colors.error : colors.textMuted;
        const Icon = status === 'pass' ? Check : status === 'fail' ? X : Circle;

        return (
          <View key={rule.id} className="flex-row items-center gap-2">
            <Icon
              size={status === 'neutral' ? 12 : 14}
              color={color}
              strokeWidth={status === 'neutral' ? 2 : 2.5}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text variant="caption" style={{ color, flex: 1 }}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
